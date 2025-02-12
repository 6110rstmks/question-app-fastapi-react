"""alter questions column

Revision ID: d0958d2d63f4
Revises: f4e715227b8e
Create Date: 2025-02-12 13:59:52.234407

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'd0958d2d63f4'
down_revision: Union[str, None] = 'f4e715227b8e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('fk_question', 'category_question', type_='foreignkey')
    op.drop_constraint('fk_category', 'category_question', type_='foreignkey')
    op.create_foreign_key(None, 'category_question', 'questions', ['question_id'], ['id'])
    op.create_foreign_key(None, 'category_question', 'categories', ['category_id'], ['id'])
    op.alter_column('questions', 'answer',
               existing_type=postgresql.ARRAY(sa.TEXT()),
               type_=sa.ARRAY(sa.String()),
               existing_nullable=False)
    op.drop_constraint('fk_question', 'subcategory_question', type_='foreignkey')
    op.drop_constraint('fk_subcategory', 'subcategory_question', type_='foreignkey')
    op.create_foreign_key(None, 'subcategory_question', 'questions', ['question_id'], ['id'])
    op.create_foreign_key(None, 'subcategory_question', 'subcategories', ['subcategory_id'], ['id'])
    op.create_unique_constraint(None, 'users', ['username'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'users', type_='unique')
    op.drop_constraint(None, 'subcategory_question', type_='foreignkey')
    op.drop_constraint(None, 'subcategory_question', type_='foreignkey')
    op.create_foreign_key('fk_subcategory', 'subcategory_question', 'subcategories', ['subcategory_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key('fk_question', 'subcategory_question', 'questions', ['question_id'], ['id'], ondelete='CASCADE')
    op.alter_column('questions', 'answer',
               existing_type=sa.ARRAY(sa.String()),
               type_=postgresql.ARRAY(sa.TEXT()),
               existing_nullable=False)
    op.drop_constraint(None, 'category_question', type_='foreignkey')
    op.drop_constraint(None, 'category_question', type_='foreignkey')
    op.create_foreign_key('fk_category', 'category_question', 'categories', ['category_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key('fk_question', 'category_question', 'questions', ['question_id'], ['id'], ondelete='CASCADE')
    # ### end Alembic commands ###
